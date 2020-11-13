import styled from "styled-components";

interface ILayout {
  size?: string;
  width?: string;
  height?: string;
}

export const AppContainer = styled.section<ILayout>`
  max-width: 1000px;
  width: 100%;
  margin: auto 0px;
`;
