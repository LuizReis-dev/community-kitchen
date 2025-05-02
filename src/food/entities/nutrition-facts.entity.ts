import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, NotNull, PrimaryKey, Table, Model } from "sequelize-typescript";
import { Food } from "./food.entity";

@Table({
    tableName: "tb_nutrition_facts",
    modelName: "NutritionFacts"
})
export class NutritionFacts extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Food)
    @Column
    declare foodId: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare calories: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare carbohydrates: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare proteins: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare facts: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare fiber: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare sugar: number;

    @Column(DataType.DECIMAL)
    @NotNull
    declare sodium: number;
   
}