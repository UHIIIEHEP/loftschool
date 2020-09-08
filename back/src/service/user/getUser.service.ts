import createConnection from '../../db/connetcing';
import User from '../../entity/user.entity';

const getUser = async (payload) => {
  console.log(payload)
  return await createConnection.then(async connection => {
    const reposytory = connection.getRepository(User);
    const result = await reposytory
      .find(payload)
      .then( res => res);
      
    return result;
  });
}

export default getUser;
