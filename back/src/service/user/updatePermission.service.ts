import createConnection from '../../db/connetcing';
import User from '../../entity/user.entity';

const updatePermission = async (payload) => {
  const result: any = await createConnection.then(async connection => {
    const reposytory = connection.getRepository(User);
    return await reposytory
      .update({
        user_id: payload.user_id,
      },
      {
        permission: JSON.stringify(payload.permission)
      });
  });
}

export default updatePermission;
