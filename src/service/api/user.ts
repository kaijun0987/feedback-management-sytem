import { feedbackRequest } from '../request';

export function fetchGetUsers(params?: Api.User.UserListQuery) {
  return feedbackRequest<Api.User.UserRecord[]>({
    url: '/admin/users',
    params
  });
}

export function fetchCreateUser(payload: Api.User.CreateUserPayload) {
  return feedbackRequest<Api.User.UserRecord>({
    url: '/admin/users',
    method: 'post',
    data: payload
  });
}

export function fetchUpdateUser(userId: string, payload: Api.User.UpdateUserPayload) {
  return feedbackRequest<Api.User.UserRecord>({
    url: `/admin/users/${userId}`,
    method: 'put',
    data: payload
  });
}
