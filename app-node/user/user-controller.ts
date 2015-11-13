var jwt = require("jwt-simple");
var User = require("./user-model.js");
var secret = 'veryBigSecret...';

export class UserController {

  constructor(private bcrypt) {
  }

  checkEmail = (email:string, error:Function, success:Function) => {
    User.findOne({email: email}, function (err, res) {
      if (err) {
        error(err);
      } else {
        if (res === null) {
          success();
        } else {
          error('This E-Mail already exists.');
        }
      }
    });


  };

  saveUser = (name:string, email:string, pwd:string, user, error:Function, success:Function) => {
    this.checkEmail(email, error, () => {
      this.bcrypt.hash(pwd, null, null, function (err, hash) {

        user.name = name;
        user.email = email;
        user.password = hash;

        user.save(function (err) {
          if (err) {
            error(err);
          } else {
            var payload = {
              sub: user._id
            };
            var token = jwt.encode(payload, secret);
            success(token);
          }
        });
      });
    });
  };

  postUser = (req, res) => {
    res.format({
      "application/json": (req, res) => {
        var body = req.body;
        this.saveUser(body.name, body.email, body.password, new User(),
          (err) => {
            console.log(err);
            res.status(400).send({message:err});
          }, (token) => {
            res.status(200).send({token: token})
          });

      }
    });
  };
}
