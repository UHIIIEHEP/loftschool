import createConnection from '../../db/connetcing';
import { INewsRespone } from '../../controllers/interface/response.interface';
import News from '../../entity/news.entity';

const newsCreate = async (payload) => {
  await createConnection.then(async connection => {
    const reposytory = connection.getRepository(News);
    return await reposytory
      .save(payload);
  });
}

export default newsCreate;
