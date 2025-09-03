import { ThemeModel } from './theme';
import IThemeRepository from './themeRepository.interface';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

export class ThemeRepository implements IThemeRepository {
  async getTheme(): Promise<ThemeModel> {
    const response = await this.readFromFile();

    return response;
  }

  private async readFromFile(): Promise<ThemeModel> {
    const root = process.cwd();
    const url = resolve(root, 'src', 'seeds', 'theme.json');
    const json = await readFile(url, 'utf-8');

    return JSON.parse(json);
  }
}
