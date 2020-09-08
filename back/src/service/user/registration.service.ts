import createConnection from '../../db/connetcing';
import { generateHach } from '../../helper';
import User from '../../entity/user.entity';

const registration = async (payload) => {
  const password = generateHach(payload.password);

  const permission = {
    chat: { C: true, R: true, U: true, D: true },
    news: { C: true, R: true, U: true, D: true },
    settings: { C: true, R: true, U: true, D: true },
  }

  const userInfo: any = {
    username: payload.username,
    surname: payload.surName,
    firstname: payload.firstName,
    middlename: payload.middleName,
    password,
    permission: JSON.stringify(permission),
  }

  let result = await createConnection.then(async connection => {
      const reposytory = connection.getRepository(User);
      return await reposytory
        .save(userInfo)
        .then((res: any) => {
          return {
            id: res.user_id,
            surName: res.surname,
            middleName: res.middlename,
            firstName: res.firstname,
            image: res.avatar,
            username: res.username,
            permission: permission,
            password: res.password,
          };
        });
    });
}

export default registration;
