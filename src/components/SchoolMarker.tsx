// components/SchoolMarker.tsx
import React, { useMemo } from "react";
import { Stop } from "../types";
import { ActionIcon, HoverCard, Text, Badge, Group } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { formatDateNicely } from "../utils/dateToString";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTimespan } from "../hooks/useTimespan";

const SchoolMarker = ({ stops }: { stops: Stop[] }) => {
  const time = useSelector((state: RootState) => state.select.time);

  return (
    <HoverCard width={350} shadow="md">
      <HoverCard.Target>
        <ActionIcon variant="filled" color="blue" size="lg">
          <IconSchool size="1.2rem" />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group mt="xs">
          <Text size="xs" fw={500}>{stops[0].name}</Text>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export default SchoolMarker;
