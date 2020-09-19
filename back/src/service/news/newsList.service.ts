import createConnection from '../../db/connetcing';
import { INewsRespone } from '../../controllers/interface/response.interface';
import News from '../../entity/news.entity';

const newsList = async () => {
  const news: INewsRespone[] = await createConnection.then(async connection => {
    const reposytory = connection.getRepository(News);
     const news = await reposytory
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.user', 'user')
      .getMany();

      return news.map((elem: any) => {
      return ({
        id: String(elem.news_id),
        created_at: elem.created_at,
        text: elem.text,
        title: elem.title,
        user: {
          firstName: elem.user.firstname,
          id: elem.user.user_id,
          image: elem.user.avatar,
          middleName: elem.user.middlename,
          surName: elem.user.surname,
          username: elem.user.username,
        }
      })
    })
  })

  return news;
}

export default newsList;
