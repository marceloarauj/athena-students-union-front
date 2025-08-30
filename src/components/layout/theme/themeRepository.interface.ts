import { ThemeModel } from './theme';

export default interface IThemeRepository {
  getTheme(): Promise<ThemeModel>;
}
