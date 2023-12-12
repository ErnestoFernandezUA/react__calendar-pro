import { ReactNode } from 'react';
import { styled } from 'styled-components';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

const Wrapper = styled.a`
  color: inherit;
  text-decoration: none;
`;

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Wrapper {...props}>
      {children}
    </Wrapper>
  );
};
