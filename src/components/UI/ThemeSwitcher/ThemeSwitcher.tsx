import styled from 'styled-components';
import { IoSunnyOutline, IoMoon } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

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
  user-select: none;
  cursor: pointer;

  & > span {
    margin-right: 0.8em;
  }
`;

const Invisible = styled.input`
  display: none;
`;

const Switcher = styled.div<{ $isDark: boolean; }>`
  height: 1.6em;
  width: 3.2em;
  background-color: var(--primary-text-color);
  border-radius: 1em;
  cursor: pointer;
  transition: 0.5s;
  display: flex;
  padding-left: ${({ $isDark }) => ($isDark ? '1.6em' : '0')};
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
    <Wrapper className="Wrapper">
      <Invisible type="checkbox" checked={isDark} onChange={themeHandler} />

      <span>
        {theme === Theme.SYSTEM && 'System'}
        {theme === Theme.DARK && 'Dark'}
        {theme === Theme.LIGHT && 'Light'}
      </span>

      <Tooltip
        anchorSelect=".Wrapper"
        place="left-start"
        delayShow={300}
        delayHide={1000}
        style={{
          zIndex: 12000,
          backgroundColor: 'var(--primary-text-color)',
          color: 'var(--background-color)',
        }}
      >
        <div>
          <h3>Choose a theme</h3>
          <p>System settings are set by default</p>
          <p>Use a toggle switch to choose the theme, please</p>
        </div>
      </Tooltip>

      <Switcher $isDark={isDark}>
        <Icon>
          {isDark
            ? <IoMoon size="80%" color="var(--primary-text-color)" />
            : <IoSunnyOutline size="80%" color="var(--primary-text-color)" />}
        </Icon>
      </Switcher>
    </Wrapper>
  );
};
