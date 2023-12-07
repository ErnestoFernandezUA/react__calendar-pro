import { styled } from 'styled-components';
import { Controls } from '../Controls';
import { ThemeSwitcher } from '../UI/ThemeSwitcher/ThemeSwitcher';

const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
`;

const TitleBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header: React.FC = () => {
  return (
    <Wrapper>
      <TitleBox>
        <h1>Calendar PRO</h1>

        <ThemeSwitcher />
      </TitleBox>

      <Controls />
    </Wrapper>
  );
};
