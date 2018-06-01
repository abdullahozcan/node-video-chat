import { GraphQLString } from 'graphql';
import { MutationResponse } from '../../types';
import pubsub, { USER_UPDATE } from '../../subscription/pubsub';

export default {
  type: MutationResponse,
  name: 'UpdateUser',
  args: {
    newEmail: { type: GraphQLString },
    newUsername: { type: GraphQLString },
  },
  async resolve(parent, { newEmail, newUsername }, req) {
    try {
      if (newEmail) req.user.email = newEmail;
      if (newUsername) req.user.username = newUsername;
      await req.user.save();
      pubsub.publish(USER_UPDATE, { userId: req.user.id });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};