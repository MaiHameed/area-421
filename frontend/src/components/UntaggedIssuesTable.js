import React from 'react';

import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableExpandHeader,
    TableHeader,
    TableBody,
    TableExpandRow,
    TableCell,
    TableExpandedRow
} from 'carbon-components-react';
import { NewTab20 } from '@carbon/icons-react';

const headers = [
    {
        header: 'Title',
        key: 'title'
    },
    {
        header: 'State',
        key: 'state'
    },
    {
        header: 'Proposed tag',
        key: 'tag'
    },
    {
        header: 'Confidence',
        key: 'confidence'
    },
    {
        header: 'Link',
        key: 'issue_url'
    }
];

const UntaggedIssuesTable = ({unlabeledIssues}) => (
    <DataTable
        headers={headers}
        rows={unlabeledIssues}
        render={({rows, headers, getHeaderProps, getRowProps}) => (
            <TableContainer title="Untagged issues">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableExpandHeader />
                            {headers.map(header => (
                                <TableHeader {...getHeaderProps({ header })}>
                                    {header.header}
                                </TableHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map(row => (
                        <React.Fragment key={row.id}>
                            <TableExpandRow {...getRowProps({ row })}>
                                {row.cells.map(cell => (
                                    <TableCell key={cell.id}>
                                        {cell.info.header === 'issue_url' ? 
                                            <a 
                                                href={cell.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <NewTab20 />
                                            </a> :
                                            cell.value
                                        }
                                    </TableCell>
                                ))}
                            </TableExpandRow>
                            {row.isExpanded && (
                                <TableExpandedRow colSpan={headers.length + 1}>
                                    <p>{unlabeledIssues.find(issue => issue.id === row.id).body || 'Nothing here 😁'}</p>
                                </TableExpandedRow>
                            )}
                        </React.Fragment>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
    />
);

export default UntaggedIssuesTable;