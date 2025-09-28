import { Router, Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

const route = Router();
const userService = new UserService();

export default (app: Router) => {
    app.use('/users', route);

    route.get('/:address',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.getUserByAddress(req.params.address);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });

    route.post('/create-attestation',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, status } = req.body;
            const user = await userService.createAttestation(address, status);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });

    route.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address } = req.body;
        const user = await userService.createUser(address);
        return res.status(200).json(user);
    }
        catch (e) {
            next(e);
        }
    });

    route.patch('/update-nft',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, status } = req.body;
            const user = await userService.updateNft(address, status);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }   
    });

    route.patch('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, status } = req.body;
            const user = await userService.updateUserStatus(address, status);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
}
