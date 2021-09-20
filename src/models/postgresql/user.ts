import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  username!: string;

  @Column({ type: 'text', nullable: false })
  email!: string;

  @Column({ type: 'text', nullable: false })
  password!: string;

  @Column({ type: 'boolean'})
  status!: boolean;

  @Column({ type: 'boolean'})
  confirmacao_registro!: boolean;

  @Column({ type: 'text', nullable: false })
  confirmacao_token!: string;

  @Column({ type: 'text', nullable: false })
  user_token!: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date?: string;
}