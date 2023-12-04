import styled from 'styled-components';
import { IoSunnyOutline, IoMoon } from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectIsDarkTheme,
  selectTheme,
  setTheme,
} from '../../../store/features/options/optionsSlice';
import { Theme } from '../../../types/theme';

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8em;
  user-select: none;
`;

const Invisible = styled.input`
  display: none;
`;

const Switcher = styled.div<{ isDark: boolean }>`
  height: 1.6em;
  width: 3.2em;
  background-color: var(--primary-text-color);
  border-radius: 1em;
  cursor: pointer;
  transition: 0.5s;
  display: flex;
  padding-left: ${({ isDark }) => (isDark ? '1.6em' : '0')};
  box-sizing: border-box;
`;

const Icon = styled.div`
  height: 1.6em;
  width: 1.6em;
  background-color: var(--background-color);
  transform: scale(0.8);
  border-radius: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThemeSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isDark = useAppSelector(selectIsDarkTheme);
  const themeHandler
  = () => dispatch(setTheme(isDark ? Theme.LIGHT : Theme.DARK));

  return (
    <Wrapper>
      {theme === Theme.SYSTEM && 'System'}
      {theme === Theme.DARK && 'Dark'}
      {theme === Theme.LIGHT && 'Light'}

      <Invisible type="checkbox" checked={isDark} onChange={themeHandler} />

      <Switcher isDark={isDark}>
        <Icon>
          {isDark
            ? <IoMoon size="80%" color="var(--primary-text-color)" />
            : <IoSunnyOutline size="80%" color="var(--primary-text-color)" />}
        </Icon>
      </Switcher>
    </Wrapper>
  );
};
