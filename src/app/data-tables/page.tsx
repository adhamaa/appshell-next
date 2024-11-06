'use client';

import { ActionIcon, Button, Center, Flex, Group, Image, MantineTheme, Text, TextInput, rem } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconClick, IconEdit, IconMessage, IconTrash, IconTrashX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, DataTableColumn, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import { useContextMenu } from 'mantine-contextmenu';
import { useCallback, useState } from 'react';
import classes from './catFacts.module.css';

type CatFacts = { fact: string; length: number };

const PAGE_SIZE = 100;

export default function CatFactsPage() {
  const { showContextMenu, hideContextMenu } = useContextMenu();

  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<CatFacts>>({
    columnAccessor: 'fact',
    direction: 'asc',
  });

  const { data, isFetching } = useQuery({
    queryKey: ['cats-fact', sortStatus.columnAccessor, sortStatus.direction, page],
    queryFn: () => fetch(`https://catfact.ninja/facts?page=${page}&limit=${PAGE_SIZE}`).then((res) => res.json()),
  });
  console.log('data:', data)

  const [selectedRecords, setSelectedRecords] = useState<CatFacts[]>([]);

  const handleSortStatusChange = (status: DataTableSortStatus<CatFacts>) => {
    setPage(1);
    setSortStatus(status);
  };

  const editRecord = useCallback(({ fact, length }: CatFacts) => {
    showNotification({
      withBorder: true,
      title: 'Editing record',
      message: `In a real application we could show a popup to edit ${fact} ${length}, but this is just a demo, so we're not going to do that`,
    });
  }, []);

  const deleteRecord = useCallback(({ fact, length }: CatFacts) => {
    showNotification({
      withBorder: true,
      color: 'red',
      title: 'Deleting record',
      message: `Should delete ${fact} ${length}, but we're not going to, because this is just a demo`,
    });
  }, []);

  const deleteSelectedRecords = useCallback(() => {
    showNotification({
      withBorder: true,
      color: 'red',
      title: 'Deleting multiple records',
      message: `Should delete ${selectedRecords.length} records, but we're not going to do that because deleting data is bad... and this is just a demo anyway`,
    });
  }, [selectedRecords.length]);

  const sendMessage = useCallback(({ fact, length }: CatFacts) => {
    showNotification({
      withBorder: true,
      title: 'Sending message',
      message: `A real application could send a message to ${fact} ${length}, but this is just a demo and we're not going to do that because we don't have a backend`,
      color: 'green',
    });
  }, []);

  const renderActions: DataTableColumn<CatFacts>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="transparent"
        color="green"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent triggering the row click function
          openModal({
            title: `Send message to ${record.fact} ${record.length}`,
            classNames: { header: classes.modalHeader, title: classes.modalTitle },
            children: (
              <>
                <TextInput mt="md" placeholder="Your message..." />
                <Group mt="md" gap="sm" justify="flex-end">
                  <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
                    Cancel
                  </Button>
                  <Button
                    color="green"
                    onClick={() => {
                      sendMessage(record);
                      closeAllModals();
                    }}
                  >
                    Send
                  </Button>
                </Group>
              </>
            ),
          });
        }}
      >
        <IconMessage size={16} />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent triggering the row click function
          editRecord(record);
        }}
      >
        <IconEdit size={16} />
      </ActionIcon>
    </Group>
  );

  const rowExpansion: DataTableProps<CatFacts>['rowExpansion'] = {
    allowMultiple: true,
    content: ({ record: { id, sex, fact, length, birthDate, department } }) => (
      <Flex p="xs" pl={rem(50)} gap="md" align="center">
        <Image
          radius="sm"
          w={50}
          h={50}
          alt={`${fact} ${length}`}
          src={`https://xsgames.co/randomusers/avatar.php?g=${sex}&q=${id}`}
        />
        <Text size="sm" fs="italic">
          {fact} {length}, born on {dayjs(birthDate).format('MMM D YYYY')}, works in {department.name} department
          at {department.company.name}.
          <br />
          His office address is {department.company.streetAddress}, {department.company.city},{' '}
          {department.company.state}.
        </Text>
      </Flex>
    ),
  };

  const handleContextMenu: DataTableProps<CatFacts>['onRowContextMenu'] = ({ record, event }) =>
    showContextMenu([
      {
        key: 'edit',
        icon: <IconEdit size={14} />,
        title: `Edit ${record.fact} ${record.length}`,
        onClick: () => editRecord(record),
      },
      {
        key: 'delete',
        title: `Delete ${record.fact} ${record.length}`,
        icon: <IconTrashX size={14} />,
        color: 'red',
        onClick: () => deleteRecord(record),
      },
      { key: 'divider' },
      {
        key: 'deleteMany',
        hidden: selectedRecords.length <= 1 || !selectedRecords.map((r) => r.id).includes(record.id),
        title: `Delete ${selectedRecords.length} selected records`,
        icon: <IconTrash size={14} />,
        color: 'red',
        onClick: deleteSelectedRecords,
      },
    ])(event);

  const now = dayjs();
  const aboveXs = (theme: MantineTheme) => `(min-width: ${theme.breakpoints.xs})`;

  const columns: DataTableProps<CatFacts>['columns'] = [
    {
      accessor: 'fact',
      noWrap: true,
      sortable: true,
    },
    {
      accessor: 'length',
      sortable: true,
    },
    {
      accessor: 'actions',
      title: (
        <Center>
          <IconClick size={16} />
        </Center>
      ),
      width: '0%', // 👈 use minimal width
      render: renderActions,
    },
  ];

  return (
    <DataTable
      height="70dvh"
      minHeight={400}
      maxHeight={1000}
      withTableBorder
      highlightOnHover
      borderRadius="sm"
      withColumnBorders
      striped
      verticalAlign="top"
      pinLastColumn
      columns={columns}
      fetching={isFetching}
      records={data?.data}
      page={page}
      onPageChange={setPage}
      totalRecords={data?.total}
      recordsPerPage={PAGE_SIZE}
      sortStatus={sortStatus}
      onSortStatusChange={handleSortStatusChange}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      rowExpansion={rowExpansion}
      onRowContextMenu={handleContextMenu}
      onScroll={hideContextMenu}
    />
  );
}