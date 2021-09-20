import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ActiveSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  token!: string;

  @Column({ type: 'text', nullable: false })
  userId!: string;

  @Column({ type: 'text', nullable: false })
  originalUrl!: string;

  @Column({ type: 'text', nullable: false })
  method!: string;  

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date?: string;
}
