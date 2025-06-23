const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const isAdmin = require('../middleware/isAdmin');




router.post('/reg', (req, res) => {
let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    login: req.body.login,
    password: req.body.password,
});
 
User.addUser(newUser, (err, user) => {
    if(err) {
        res.json({success: false, msg: "User has not been added."})
    }
    else {
        res.json({success: true, msg: "User has been added."})
    }
})
});


router.post('/auth', (req, res) => {
const login = req.body.login;
const password = req.body.password;

User.getUserByLogin(login,(err,user) => {
    if(err) throw err;
    if(!user) {
        return res.json({success: false, msg: "This user was not found."})
    };
User.comparePass(password, user.password, (err, isMatch) => {
    if(err) throw err;
    if(isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 3600 * 24
        });
        res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
                id: user._id,
                name: user.name,
                login: user.login,
                email: user.email,
                role: user.role 
            }
        })
    }
    else {
        return res.json({success: false, msg: "Password mismatch"})
    }
})
})
});

router.get('/dashboard', passport.authenticate('jwt', {session:false}), (req, res) => {
res.send("Dashboard")
});

router.post('/dashboard',passport.authenticate('jwt',{session:false}), (req, res) => {
   console.log('TOKEN:', req.headers.authorization);
    console.log('USER:', req.user);

  let newPost = new Post({
        category: req.body.category,
        title: req.body.title,
        photo: req.body.photo,
        text: req.body.text,
       author: req.user.login,
        date: req.body.date,
    });

    Post.addPost(newPost, (err, user) => {
        if(err) {
            res.json({success: false, msg: "Post has not been added."})
        }
        else {
            res.json({success: true, msg: "Post has been added."})
        }
    });
});

router.get(
  '/all-posts',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  (req, res) => {
    // ...код для отримання всіх постів...
  }
);

//! Редагування поста
router.put('/post/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    
    if (err || !post) return res.status(404).json({ success: false, msg: 'Post not found' });

    if (post.author === req.user.login || req.user.role === 'admin') {
      post.title = req.body.title;
      post.text = req.body.text;
      post.category = req.body.category;
      post.photo = req.body.photo;
      post.save((err) => {
        if (err) return res.json({ success: false, msg: 'Error updating post' });
        res.json({ success: true, msg: 'Post updated' });
      });
    } else {
      res.status(403).json({ success: false, msg: 'Access denied' });
    }
  });
});

router.delete('/post/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

    // Дозволяємо видаляти адміну або автору поста
    if (req.user.role !== 'admin' && post.author !== req.user.login) {
      return res.status(403).json({ success: false, msg: 'Access denied' });
    }

    await post.deleteOne();
    res.json({ success: true, msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting post' });
  }
});

 /// список користувачів
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log('USER:', req.user); // ДОДАЙТЕ ЦЕ
    next();
  }, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // без пароля
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching users' });
  }
});
///список постів користувача
router.get('/user-posts/:login', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {  console.log('USER:', req.user, 'PARAM:', req.params.login);
    // Дозволяємо тільки власнику або адміну бачити свої пости
    if (req.user.login !== req.params.login && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied' });
    }
    const posts = await Post.find({ author: req.params.login });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching posts' });
  }
});
router.delete('/user/:id', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    res.json({ success: true, msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting user' });
  }
});

// Додавання коментаря до поста
router.post('/post/:id/comment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

    const comment = {
      author: req.user.login,
      text: req.body.text,
      date: new Date()
    };
    post.comments.push(comment);
    await post.save();
    res.json({ success: true, msg: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error adding comment' });
  }
});
router.get('/post/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, 'comments');
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching comments' });
  }
});
// Видалення коментаря з поста (тільки для адміну)
router.delete('/post/:postId/comment/:commentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, msg: 'Comment not found' });

    // Дозволяємо видаляти адміну або автору коментаря
    if (req.user.role !== 'admin' && comment.author !== req.user.login) {
      return res.status(403).json({ success: false, msg: 'Access denied' });
    }

    comment.remove();
    await post.save();
    res.json({ success: true, msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting comment' });
  }
});


module.exports = router;