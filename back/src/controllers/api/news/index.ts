import { newsList, newsCreate, newsDelete, newsUpdate } from '../../../service/news/index.service';

const news = {
  getNews: async(req, res) => {
    const result = await newsList();
    res.send(result);
  },

  setNews: async (req, res) => {
    await newsCreate({
      text: req.body.text,
      title: req.body.title,
      user_id: req.body.user_id,
    });

    const result = await newsList();

    res.send(result);
  },

  updateNews: async (req, res) => {
    
    const payload = {
      text: req.body.text,
      title: req.body.title,
    }
    
    await newsUpdate(req.params.id, payload);

    const result = await newsList();

    res.send(result);
  },

  deleteNews: async (req, res) => {
    await newsDelete({
      id: req.params.id,
    });

    const result = await newsList();

    res.send(result);
  },
}

export default news;
