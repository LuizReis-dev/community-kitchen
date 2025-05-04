import { AutoIncrement, Column, CreatedAt, DataType, DeletedAt, HasOne, PrimaryKey, Table, Model, NotNull, AllowNull } from "sequelize-typescript";
import { NutritionFacts } from "./nutrition-facts.entity";

@Table({
    tableName: "tb_foods",
    modelName: "Food",
    timestamps: true
})
export class Food extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @HasOne(() => NutritionFacts)
    declare nutritionFacts: NutritionFacts;

    @Column({type: DataType.STRING, allowNull: false})
    declare name: string;
    
    @CreatedAt
    declare createdAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;
}
