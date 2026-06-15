/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'pannellum-react' {
  import * as React from 'react';

  export interface PannellumProps {
    width?: string;
    height?: string;
    image: string;
    pitch?: number;
    yaw?: number;
    hfov?: number;
    autoLoad?: boolean;
    autoRotate?: number;
    compass?: boolean;
    title?: string;
    author?: string;
    preview?: string;
    showZoomCtrl?: boolean;
    keyboardZoom?: boolean;
    mouseZoom?: boolean;
    draggable?: boolean;
    showFullscreenCtrl?: boolean;
    showControls?: boolean;
    onLoad?: () => void;
    onError?: (err: any) => void;
    onRender?: () => void;
    children?: React.ReactNode;
  }

  export class Pannellum extends React.Component<PannellumProps> {
    static Hotspot: React.FC<any>;
  }
}
