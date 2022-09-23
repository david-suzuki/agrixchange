import { withIronSession } from "next-iron-session";

export default withIronSession(
  async (req, res) => {
    if (req.method === "POST") {
        const { user } = req.body;
        console.log( user )
        if (user) {
            req.session.set("user", { user });
            await req.session.save();
            return res.status(201).send("");
        }

        return res.status(403).send("");
    }

    return res.status(404).send("");
  },
  {
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.APPLICATION_SECRET
  }
);
