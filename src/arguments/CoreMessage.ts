import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'discord.js';
import { resolveMessage } from '../lib/resolvers/message';
import { Argument } from '../lib/structures/Argument';
import type { MessageArgumentContext } from '../lib/types/ArgumentContexts';

export class CoreArgument extends Argument<Message> {
	public constructor(context: PieceContext) {
		super(context, { name: 'message' });
	}

	public async run(parameter: string, context: MessageArgumentContext): Argument.AsyncResult<Message> {
		const channel = context.channel ?? context.message.channel;
		const resolved = await resolveMessage(parameter, {
			messageOrInteraction: context.message,
			channel: context.channel,
			scan: context.scan ?? false
		});

		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The given argument did not resolve to a message.',
				context: { ...context, channel }
			})
		);
	}
}
