import { styled } from 'styled-components';
import { Controls } from '../Controls';
import { ThemeSwitcher } from '../UI/ThemeSwitcher/ThemeSwitcher';
import { Link } from '../UI/Link';

// eslint-disable-next-line max-len
const linkProfile = 'https://www.notion.so/efernandez/Ernesto-Fernandez-c5f9c67e8cdb4f9bbfe97fcf8f68dcc8';

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
        <Link href={linkProfile} target="_blank">
          <h1>Calendar PRO</h1>
        </Link>

        <ThemeSwitcher />
      </TitleBox>

      <Controls />
    </Wrapper>
  );
};
