<?php

namespace App\Repositories\Contracts;

interface RepositoryInterface
{
    public function all(array $columns = ['*']);
    public function paginate(int $perPage = 15, array $columns = ['*']);
    public function create(array $data);
    public function update(mixed $id, array $data);
    public function delete(mixed $id);
    public function find(mixed $id, array $columns = ['*']);
    public function findBy(string $field, mixed $value, array $columns = ['*']);
}