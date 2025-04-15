"use client";

import React, { FunctionComponent } from "react";
import {
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
  VerticalLayout,
} from "@jsonforms/core";
import { withJsonFormsLayoutProps } from "@jsonforms/react";
import {
  VanillaRendererProps,
  withVanillaControlProps,
  WithChildren,
} from "@jsonforms/vanilla-renderers";
import { JsonSchema, Layout } from "@jsonforms/core";
import { JsonFormsDispatch, useJsonForms } from "@jsonforms/react";
import { useMantineTheme } from "@mantine/core";

export const JsonFormsLayout = ({
  className,
  children,
  visible,
}: RendererProps & VanillaRendererProps & WithChildren) => {
  return (
    <div
      className={className}
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {children}
    </div>
  );
};

export interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  className: string;
  path: string;
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  className: string,
  path: string,
  enabled: boolean
) => {
  const { renderers, cells } = useJsonForms();
  const theme = useMantineTheme();

  return layout.elements.map((child, index) => {
    return (
      <div
        className={className}
        key={`${path}-${index}`}
        style={{ marginTop: index === 0 ? 0 : theme.spacing.xs }}
      >
        <JsonFormsDispatch
          renderers={renderers}
          cells={cells}
          uischema={child}
          schema={schema}
          path={path}
          enabled={enabled}
        />
      </div>
    );
  });
};

export const VerticalLayoutRenderer = (
  props: RendererProps & VanillaRendererProps
) => {
  const { data: _data, ...otherProps } = props;
  // We don't hand over data to the layout renderer to avoid rerendering it with every data change
  return <VerticalLayoutRendererComponent {...otherProps} />;
};

const VerticalLayoutRendererComponent: FunctionComponent<
  RendererProps & VanillaRendererProps
> = React.memo(function VerticalLayoutRendererComponent({
  schema,
  uischema,
  path,
  visible,
  enabled,
  getStyle,
  getStyleAsClassName,
}: RendererProps & VanillaRendererProps) {
  const verticalLayout = uischema as VerticalLayout;
  const layoutClassName = "";
  const childClassNames = "";

  return (
    <JsonFormsLayout
      className={layoutClassName}
      uischema={uischema}
      schema={schema}
      visible={visible}
      enabled={enabled}
      path={path}
      getStyle={getStyle}
      getStyleAsClassName={getStyleAsClassName}
    >
      {renderChildren(verticalLayout, schema, childClassNames, path, enabled)}
    </JsonFormsLayout>
  );
});

export default withVanillaControlProps(
  withJsonFormsLayoutProps(VerticalLayoutRenderer, false)
);
