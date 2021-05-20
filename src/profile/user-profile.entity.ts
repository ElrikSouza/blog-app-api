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
  profile_name: string;

  @Column()
  bio: string;
}
