import { IsString } from 'class-validator';

export class CurrentMonthTestDto {
  @IsString()
  currentMonth: string;
}
