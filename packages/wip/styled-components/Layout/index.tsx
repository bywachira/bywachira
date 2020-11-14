import styled from "styled-components";

interface ILayout {
  size?: string;
  width?: string;
  height?: string;
}

export const AppContainer = styled.section<ILayout>`
  max-width: 1000px;
  width: 100%;
  margin: 0px auto;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  /* position: fixed; */
  place-items: center;
`;

export const NavContainer = styled.header`
  width: 100%;
  max-width: 1000px;
  margin: 0px auto;
  height: 80px;
  place-items: center;
  padding: 16px 0px;
`;

export const Logo = styled.img`
  width: 40px;
  display: flex;
  place-items: center;
`;
