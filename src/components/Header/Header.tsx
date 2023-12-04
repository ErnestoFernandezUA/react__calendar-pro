import { styled } from 'styled-components';
import { Controls } from '../Controls';
import { ThemeSwitcher } from '../UI/ThemeSwitcher/ThemeSwitcher';

const TitleBox = styled.div`
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header: React.FC = () => {
  return (
    <header>
      <TitleBox>
        <h1>Calendar PRO MAX</h1>

        <ThemeSwitcher />
      </TitleBox>

      <Controls />
    </header>
  );
};
