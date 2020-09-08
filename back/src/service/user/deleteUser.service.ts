import createConnection from '../../db/connetcing';
import User from '../../entity/user.entity';

const deleteUser = async (payload) => {  
  return await createConnection.then(async connection => {
    const reposytory = connection.getRepository(User);
    return await reposytory
      .delete({
        user_id: payload.id,
      })
      .then(res => res);
  });
}

export default deleteUser;
