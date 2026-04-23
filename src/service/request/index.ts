import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

function createAppRequest(targetBaseURL: string, headers?: Record<string, string>) {
  const appRequest = createFlatRequest(
    {
      baseURL: targetBaseURL,
      headers
    },
    {
      defaultState: {
        errMsgStack: [],
        refreshTokenPromise: null
      } as RequestInstanceState,
      transform(response: AxiosResponse<App.Service.Response<any>>) {
        return response.data.data;
      },
      async onRequest(config) {
        const Authorization = getAuthorization();
        Object.assign(config.headers, { Authorization });

        return config;
      },
      isBackendSuccess(response) {
        return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
      },
      async onBackendFail(response, instance) {
        const authStore = useAuthStore();
        const responseCode = String(response.data.code);

        function handleLogout() {
          authStore.resetStore();
        }

        function logoutAndCleanup() {
          handleLogout();
          window.removeEventListener('beforeunload', handleLogout);

          appRequest.state.errMsgStack = appRequest.state.errMsgStack.filter(msg => msg !== response.data.msg);
        }

        const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
        if (logoutCodes.includes(responseCode)) {
          handleLogout();
          return null;
        }

        const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
        if (modalLogoutCodes.includes(responseCode) && !appRequest.state.errMsgStack?.includes(response.data.msg)) {
          appRequest.state.errMsgStack = [...(appRequest.state.errMsgStack || []), response.data.msg];

          window.addEventListener('beforeunload', handleLogout);

          window.$dialog?.error({
            title: $t('common.error'),
            content: response.data.msg,
            positiveText: $t('common.confirm'),
            maskClosable: false,
            closeOnEsc: false,
            onPositiveClick() {
              logoutAndCleanup();
            },
            onClose() {
              logoutAndCleanup();
            }
          });

          return null;
        }

        const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
        if (expiredTokenCodes.includes(responseCode)) {
          const success = await handleExpiredRequest(appRequest.state);
          if (success) {
            const Authorization = getAuthorization();
            Object.assign(response.config.headers, { Authorization });

            return instance.request(response.config) as Promise<AxiosResponse>;
          }
        }

        return null;
      },
      onError(error) {
        let message = error.message;
        let backendErrorCode = '';

        if (error.code === BACKEND_ERROR_CODE) {
          message = error.response?.data?.msg || message;
          backendErrorCode = String(error.response?.data?.code || '');
        }

        const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
        if (modalLogoutCodes.includes(backendErrorCode)) {
          return;
        }

        const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
        if (expiredTokenCodes.includes(backendErrorCode)) {
          return;
        }

        showErrorMsg(appRequest.state, message);
      }
    }
  );

  return appRequest;
}

export const request = createAppRequest(baseURL);

export const feedbackRequest = createAppRequest(otherBaseURL.feedback || baseURL);

export const demoRequest = createRequest(
  {
    baseURL: otherBaseURL.demo
  },
  {
    transform(response: AxiosResponse<App.Service.DemoResponse>) {
      return response.data.result;
    },
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
