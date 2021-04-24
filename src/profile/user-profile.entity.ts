import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  account_id: string;

  @Column()
  display_name: string;

  @Column()
  username: string;

  @Column()
  bio: string;
}
