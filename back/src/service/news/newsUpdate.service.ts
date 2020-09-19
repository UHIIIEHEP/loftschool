import createConnection from '../../db/connetcing';
import News from '../../entity/news.entity';

const newsUpdate = async (news_id, payload) => {
  return await createConnection.then(async connection => {
    const reposytory = connection.getRepository(News);
    return await reposytory
      .update({
        news_id,
      }, payload)
      .then(res => res);
  });
}

export default newsUpdate;
