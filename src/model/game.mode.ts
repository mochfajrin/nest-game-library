import { Game } from '@prisma/client';

export class CreateGameRequest {
  title: string;
  image?: string;
  summary?: string;
}

export class UpdateGameRequest {
  title?: string;
  image?: string;
  image_id?: string;
  summary?: string;
}

export class GameResponse {
  id: string;
  user_id: string;
  title: string;
  image?: string;
  summary?: string;
}

export function toGameResponse(game: Game): GameResponse {
  return {
    id: game.id,
    user_id: game.user_id,
    title: game.title,
    summary: game?.summary,
    image: game?.image,
  };
}
