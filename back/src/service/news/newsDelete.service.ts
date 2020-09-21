import createConnection from '../../db/connetcing';
import News from '../../entity/news.entity';

const newsDelete = async (payload) => {
  await createConnection.then(async connection => {
    const reposytory = connection.getRepository(News);
    return await reposytory
      .delete({
        news_id: payload.id,
      })
      .then(res => res);
  });
}

export default newsDelete;
