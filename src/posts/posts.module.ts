import { PrismaService } from '@/database/prisma/prisma.service';
import { DatabaseModule } from '@faker-js/faker/.';
import { Module } from '@nestjs/common';
import { PostsRepository } from './repositories/posts.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PostsRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
  ],
})
export class PostsModule {}
