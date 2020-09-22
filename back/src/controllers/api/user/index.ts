import createConnection from '../../../db/connetcing';
import User from "../../../entity/user.entity";
import { ILoginUserResponse } from '../../interface/user.interface';
import { generateHach, generateToken } from '../../../helper';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { IUserAuthResponse, IUserResponse, ITokenRespone } from '../../interface/response.interface';
import { registration, getUser, deleteUser, updatePermission } from '../../../service/user/index.service';

const user = {
  registration: async (req, res) => {
    const user = await registration(req.body);      
    res.send(user);
  },

  login: async (req, res) => {
    const result: ILoginUserResponse[] = await getUser({username: req.body.username});

    if (!result.length) {
      res.status(403);
      res.send('unauthorized');
      throw new Error('unauthorized');
    }
    
    const {
      user_id,
      password,
      surname,
      middlename,
      firstname,
      avatar,
      username,
      permission
    } = result[0];

    if (password === generateHach(req.body.password)) {
      const {
        token: refreshToken,
        dateDead: refreshTokenExpiredAt
      } = generateToken({
        user_id,
      },
      'refresh')

      const {
        token: accessToken,
        dateDead: accessTokenExpiredAt
      } = generateToken({
        user_id,
      },
      'access')

      const usr: IUserAuthResponse = {
        id: user_id,
        surName: surname,
        middleName: middlename,
        firstName: firstname,
        image: avatar,
        username,     
        permission: JSON.parse(permission),       
        accessToken,
        refreshToken,
        accessTokenExpiredAt,
        refreshTokenExpiredAt,
      };

      res.send(usr);
    } else {
      res.status(403);
      res.send('unauthorized');
      throw new Error('unauthorized');
    }    
  },

  updateToken: (req, res) => {
    const { user_id } = req.body;

    const {
      token: refreshToken,
      dateDead: refreshTokenExpiredAt
    } = generateToken({
      user_id,
    },
    'refresh')

    const {
      token: accessToken,
      dateDead: accessTokenExpiredAt
    } = generateToken({
      user_id,
    },
    'access')

    const token: ITokenRespone = {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    }

    res.send(token);
  },

  profile: async (req, res) => {
    const { user_id } = req.body;
    
    let result = await getUser({user_id});

    const {
      surname,
      middlename,
      firstname,
      avatar,
      username,
      permission
    } = result[0];
    
    const {
      token: refreshToken,
      dateDead: refreshTokenExpiredAt
    } = generateToken({
      user_id,
    },
    'refresh')

    const {
      token: accessToken,
      dateDead: accessTokenExpiredAt
    } = generateToken({
      user_id,
    },
    'access')

    const usr: IUserAuthResponse = {
      id: user_id,
      surName: surname,
      middleName: middlename,
      firstName: firstname,
      image: avatar,
      username: username,     
      permission: JSON.parse(permission),       
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };

    res.send(usr)
  },

  updateProfile: async(req, res) => {
    const { user_id } = req.body;

    const form = new formidable.IncomingForm({
      uploadDir: path.resolve(process.cwd(),'../front/upload/avatar'),
    });

    let userInfoUpdate = {};
    await form.parse(req, async (err, fields, files) => {
      if (!!files.avatar) {
        const upload = path.resolve(process.cwd(),'../front/upload/avatar');

        if (!fs.existsSync(upload)) {
          fs.mkdirSync(upload);
        }
        
        const fileName = path.join(upload, files.avatar.name);

        userInfoUpdate['avatar'] = `upload/avatar/${files.avatar.name}`;

        fs.rename(files.avatar.path, fileName, (err) => {
          if (err !== null) {
            console.log({err})
          }
        });
      }

      for (const key in fields) {
        if (fields[key] !== 'undefined' && fields[key] !== '' && fields[key] !== 'null') {
          userInfoUpdate[key.toLowerCase()] = fields[key];
        }
      }

      await createConnection.then(async connection => {
        return await connection.getRepository(User)
          .update({
            user_id,
          },
          userInfoUpdate);
      });

      const userInfo: ILoginUserResponse = await createConnection.then(async connection => {
        return await connection.getRepository(User)
          .findOne({user_id})
          .then(res => res);
      });
      
      const {
        token: refreshToken,
        dateDead: refreshTokenExpiredAt
      } = generateToken({
        user_id,
      },
      'refresh')
  
      const {
        token: accessToken,
        dateDead: accessTokenExpiredAt
      } = generateToken({
        user_id,
      },
      'access')
  
      const result: IUserAuthResponse = {
        id: userInfo.user_id,
        surName: userInfo.surname,
        middleName: userInfo.middlename,
        firstName: userInfo.firstname,
        image: userInfo.avatar,
        username: userInfo.username,     
        permission: JSON.parse(userInfo.permission),       
        accessToken,
        refreshToken,
        accessTokenExpiredAt,
        refreshTokenExpiredAt,
      };
      
      res.send(result);
    });
  },

  deleteUser: async (req, res) => {
    const user = await deleteUser({id: req.params.id})

    res.send(user.affected.toString());
  },

  getUsers: async (req, res) => {
    const userInfo: any = await getUser({});

    const result: IUserResponse[] = userInfo.map((elem: any) => {
      const result = {
        id: elem.user_id,
        surName: elem.surname,
        middleName: elem.middlename,
        firstName: elem.firstname,
        image: elem.avatar || '',
        username: elem.username,     
        permission: JSON.parse(elem.permission),
      }

      return result;
    })

    res.send(result);
  },

  permissionUser: async (req, res) => {
    const permission = await updatePermission({
      user_id: req.params.id,
      permission: req.body.permission
    })

    res.send(permission);
  },
}

export default user;
