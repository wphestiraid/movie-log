import User from '../../../entity/User';
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import cleanNullArgs from '../../../utils/cleanNullArgs';
import privateResolver from '../../../utils/privateResolver';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNull: any = cleanNullArgs(args);
        if (notNull.password) {
          user.password = notNull.password;
          user.save();
          delete notNull.password;
        }
        Object.keys(args).forEach(key => {
          if (args[key] !== null) {
            notNull[key] = args[key];
          }
        });
        try {
          await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return { ok: false, error: error.message };
        }
      }
    )
  }
};

export default resolvers;
