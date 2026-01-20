import type { Meta, StoryObj } from "@storybook/react";
import { PaginationControls } from "../pagination-controls";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

const meta: Meta<typeof PaginationControls> = {
    title: "Navigation/PaginationControls",
    component: PaginationControls,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaginationControls>;

const PaginationWithState = ({
    totalCount,
    pageSize = 10,
    unit,
    showTotalCount = true,
}: {
    totalCount: number;
    pageSize?: number;
    unit?: string | ((plural: boolean) => string);
    showTotalCount?: boolean;
}) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize,
    });
    return (
        <div className="w-96">
            <PaginationControls
                pagination={pagination}
                setPagination={setPagination}
                totalCount={totalCount}
                unit={unit}
                showTotalCount={showTotalCount}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <PaginationWithState totalCount={100} />,
};

export const SmallDataset: Story = {
    render: () => <PaginationWithState totalCount={15} />,
};

export const LargeDataset: Story = {
    render: () => <PaginationWithState totalCount={1000} />,
};

export const CustomUnit: Story = {
    render: () => (
        <PaginationWithState
            totalCount={50}
            unit={(plural) => (plural ? "users" : "user")}
        />
    ),
};

export const LinksUnit: Story = {
    render: () => (
        <PaginationWithState
            totalCount={256}
            unit={(plural) => (plural ? "links" : "link")}
        />
    ),
};

export const HideTotalCount: Story = {
    render: () => (
        <PaginationWithState totalCount={100} showTotalCount={false} />
    ),
};

export const LargerPageSize: Story = {
    render: () => <PaginationWithState totalCount={500} pageSize={25} />,
};

export const SinglePage: Story = {
    render: () => <PaginationWithState totalCount={5} />,
};
