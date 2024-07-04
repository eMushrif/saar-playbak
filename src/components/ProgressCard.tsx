import { useSelector } from "react-redux";
import { useSelectedStops } from "../hooks/useSelectedStops";
import { useSelectedTrip } from "../hooks/useSelectedTrip";
import { RootState } from "../store";
import { Card, Image, Text, Badge, Button, Group, Table } from '@mantine/core';
import React from "react";
import { formatDateNicely } from "../utils/dateToString";
import { useStops } from "../hooks/useStops";




const ProgressCard: React.FC = () => {
  const trip = useSelectedTrip();
  const stops = useStops();
  const time = useSelector((state: RootState) => state.select.time);

  if (!trip || !time) return null;

  
  return (
    <Card shadow="sm" padding="md" radius="xs" withBorder style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Stop</Table.Th>
          <Table.Th>Pickup</Table.Th>
          <Table.Th>Dropoff</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {stops.filter(stop => stop.type !== 'School').map((stop, index) => (
        <Table.Tbody key={stop.id}>
          <Table.Tr>
            <Table.Td><Text size="xs">{stop.name}</Text></Table.Td>
            <Table.Td>{
              (stop.actualPickupTime && stop.actualPickupTime.getTime() <= time) ||
              (stop.noshowTime && stop.noshowTime.getTime() <= time)
                ? <Text size="xs">{formatDateNicely((stop.actualPickupTime || stop.noshowTime) as any)}</Text>
                : <Badge size="xs" color="gray">Pending</Badge>
            }</Table.Td>
            <Table.Td>{
              (stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= time)
                ? <Text size="xs">{formatDateNicely(stop.actualDropoffTime as any)}</Text>
                : <Badge size="xs" color="gray">Pending</Badge>
            }</Table.Td>
            <Table.Td>{
              (stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= time)
              ? <Badge size="xs" color="green">Dropoff</Badge> :
              (stop.actualPickupTime && stop.actualPickupTime.getTime() <= time)
                ? <Badge size="xs" color="orange">Pickup</Badge>
                : (stop.noshowTime && stop.noshowTime.getTime() <= time)
                  ? <Badge size="xs" color="red">No Show</Badge>
                  : <Badge size="xs" color="gray">Pending</Badge>
            }</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      ))}
      </Table>
    </Card>
  );
}

export default ProgressCard;