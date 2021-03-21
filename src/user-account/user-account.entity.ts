import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserAccount {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
