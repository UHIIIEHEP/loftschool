

export interface IRegistrationUser {
  username: string,
  surname: string,
  firstname: string,
  middlename: string,
  password: string,
}

export interface ILoginUser {
  username: string,
  password: string,
}

// delete
export interface ILoginUserResponse extends IRegistrationUser {
  user_id: number,
  avatar: string,
  permission: any,
}

// export interface ISessionResponse {
//   session_id: number,
// }

export interface IPayloadToken {
  userId: number,
  dateDead: number,
}
