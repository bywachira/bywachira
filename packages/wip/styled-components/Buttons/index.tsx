import styled from "styled-components";

interface IButtons {
  color?: string;
  bgColor?: string;
  fSize?: string;
  padding?: string;
  width?: string;
  height?: string;
}

export const Button = styled.button<IButtons>`
  color: ${(props) => props.color || "white"};
  background: ${(props) => props.bgColor || "black"};
  font-size: ${(props) => props.fSize || "12px"};
  padding: ${(props) => props.padding || "4px"};
  width: ${(props) => props.width || "80px"};
  height: ${(props) => props.height || "40px"};
`;
