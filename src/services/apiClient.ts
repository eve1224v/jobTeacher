/**
 * Safe API Client for AutoInsight AI
 * Handles Content-Type checking, HTTP error diagnostics, and prevents
 * "Unexpected token '<' / 'T' ... is not valid JSON" errors in Vercel.
 */

export interface ApiErrorDetails {
  status: number;
  message: string;
  isHtmlResponse?: boolean;
  endpoint: string;
}

export class ApiError extends Error {
  status: number;
  isHtmlResponse: boolean;
  endpoint: string;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.status = details.status;
    this.isHtmlResponse = details.isHtmlResponse || false;
    this.endpoint = details.endpoint;
  }
}

export async function safeApiPost<T = any>(
  endpoint: string,
  body: any,
  options?: RequestInit
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      ...options,
    });
  } catch (networkError: any) {
    console.error(`[네트워크 오류] ${endpoint} 통신 실패:`, networkError?.message || networkError);
    throw new ApiError({
      status: 0,
      message: `네트워크 연결에 실패했습니다 (${networkError?.message || '연결 불가'}).`,
      endpoint,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  // Check HTTP Status
  if (!response.ok) {
    let errorDetail = '';
    if (isJson) {
      try {
        const errJson = await response.json();
        if (typeof errJson.error === 'string') {
          errorDetail = errJson.error;
        } else if (errJson.error && typeof errJson.error === 'object') {
          errorDetail = errJson.error.message || errJson.error.code || JSON.stringify(errJson.error);
        } else if (typeof errJson.message === 'string') {
          errorDetail = errJson.message;
        } else if (errJson.message && typeof errJson.message === 'object') {
          errorDetail = errJson.message.message || errJson.message.code || JSON.stringify(errJson.message);
        } else if (typeof errJson.detail === 'string') {
          errorDetail = errJson.detail;
        } else {
          errorDetail = typeof errJson === 'string' ? errJson : JSON.stringify(errJson);
        }
      } catch {
        // ignore JSON parse error
      }
    } else {
      try {
        const errText = await response.text();
        if (errText.includes('The page could not be found') || errText.includes('404')) {
          errorDetail = 'Vercel 서버리스 함수 경로를 찾을 수 없습니다 (404 Not Found).';
        } else if (errText.includes('FUNCTION_INVOCATION_TIMEOUT')) {
          errorDetail = 'Vercel 서버리스 실행 시간 제한을 초과했습니다 (10초).';
        } else {
          errorDetail = errText.slice(0, 150);
        }
      } catch {
        // ignore
      }
    }

    let userFriendlyMessage = `서버 응답 오류 (HTTP ${response.status})`;
    if (response.status === 404) {
      userFriendlyMessage = `[404 Not Found] API 엔드포인트(${endpoint})를 찾을 수 없습니다. Vercel 서버리스 함수(api/[...path].ts)가 배포되었는지 확인해주세요.`;
    } else if (response.status === 401 || response.status === 403) {
      userFriendlyMessage = `[인증 오류] Gemini API 키 인증에 실패했습니다 (${response.status}). Vercel 환경변수(GEMINI_API_KEY) 설정을 확인해주세요.`;
    } else if (response.status === 429) {
      userFriendlyMessage = `[429 Too Many Requests] AI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.`;
    } else if (response.status === 504) {
      userFriendlyMessage = `[504 Gateway Timeout] AI 처리 시간이 제한을 초과했습니다. 다시 시도해주세요.`;
    } else if (response.status >= 500) {
      userFriendlyMessage = `[500 Server Error] AI 서버 처리 중 오류가 발생했습니다: ${errorDetail || '내부 오류'}`;
    } else if (errorDetail) {
      userFriendlyMessage = `[${response.status} 오류] ${errorDetail}`;
    }

    console.warn(`[API 오류] ${endpoint} - 상태코드: ${response.status}`, { detail: errorDetail });

    throw new ApiError({
      status: response.status,
      message: userFriendlyMessage,
      isHtmlResponse: !isJson,
      endpoint,
    });
  }

  // If response is OK (200), verify that content-type is really JSON
  if (!isJson) {
    const rawText = await response.text();
    console.warn(`[API 경고] ${endpoint} 에서 JSON이 아닌 Content-Type(${contentType})이 반환됨.`, rawText.slice(0, 150));
    
    // Check if Vercel returned HTML fallback for a 404 route
    if (rawText.startsWith('<!doctype html>') || rawText.startsWith('<html') || rawText.includes('The page could not be found')) {
      throw new ApiError({
        status: 404,
        message: `[Vercel 라우팅 오류] ${endpoint} 요청에 대해 HTML 페이지가 반환되었습니다. Vercel 서버리스 함수 배포를 확인해주세요.`,
        isHtmlResponse: true,
        endpoint,
      });
    }

    throw new ApiError({
      status: response.status,
      message: `서버에서 JSON 형식이 아닌 데이터가 반환되었습니다. (${contentType})`,
      isHtmlResponse: true,
      endpoint,
    });
  }

  // Parse JSON safely
  try {
    return (await response.json()) as T;
  } catch (parseError: any) {
    console.error(`[JSON 파싱 오류] ${endpoint} 파싱 실패:`, parseError?.message);
    throw new ApiError({
      status: response.status,
      message: `서버 응답을 JSON으로 변환할 수 없습니다: ${parseError?.message}`,
      endpoint,
    });
  }
}
