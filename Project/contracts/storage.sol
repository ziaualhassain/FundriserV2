//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

contract A{
    uint private a=10;
    uint private b=20;
    uint[] arr;

    function addElements(uint value)external{
        arr.push(value);
    }
}