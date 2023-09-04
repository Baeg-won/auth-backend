import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public userId: string;

  @Column()
  public userPassword: string;

  @Column({ nullable: true })
  public refreshToken: string;
}

export default User;
