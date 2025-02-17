import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { AuthorsRepository } from './repositories/authors.repository'

@Module({
  imports: [DatabaseModule],
  providers: [AuthorsResolver, PrismaService, AuthorsRepository],
})
export class AuthorsModule {}
