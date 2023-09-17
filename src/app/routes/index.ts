import express from 'express';
import { BlogRoutes } from '../module/blog/blog.router';
import { UserRoutes } from '../module/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes
  },
  {
    path: "/blog",
    route: BlogRoutes
  },
];

moduleRoutes.forEach(routes => router.use(routes.path, routes.route));
export default router;
